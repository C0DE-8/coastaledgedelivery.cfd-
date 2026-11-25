import { PageHero } from '../../components/shared/Shared'
import { useEffect, useState } from 'react'
import { trackShipment } from '../../api/shipping'

const statusDetails = {
  hold: {
    label: 'On hold',
    description: 'This shipment is temporarily paused. Our team will post an update when it is ready to move.',
  },
  active: {
    label: 'Being prepared',
    description: 'Your shipment is being prepared for dispatch.',
  },
  shipped: {
    label: 'Shipped',
    description: 'Your shipment has left the sender and is moving through the delivery network.',
  },
  in_transit: {
    label: 'In transit',
    description: 'Your shipment is on its way. Check the tracking history below for its latest recorded movement.',
  },
  delivered: {
    label: 'Delivered',
    description: 'This shipment has been marked as delivered.',
  },
}

function formatStatus(status) {
  const key = String(status || '').trim().toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
  return statusDetails[key] || {
    label: key ? key.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'In progress',
    description: 'This is the latest status recorded for your shipment. Check back for new updates.',
  }
}

function formatDate(value, includeTime = false) {
  if (!value) return null

  const dateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  const date = new Date(dateOnly ? `${value}T00:00:00Z` : value)
  if (Number.isNaN(date.getTime())) return 'Date to be confirmed'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    ...(includeTime && !dateOnly ? { timeStyle: 'short' } : {}),
    ...(dateOnly ? { timeZone: 'UTC' } : {}),
  }).format(date)
}

function hasCoordinates(lat, lng) {
  const isNumber = (value) => value !== null && value !== undefined && String(value).trim() !== '' && Number.isFinite(Number(value))
  return isNumber(lat) && isNumber(lng)
}

function ShipmentMap({ shipment, trackerNumber }) {
  const points = [
    { key: 'origin', label: 'Origin', place: shipment.sender_address, lat: shipment.sender_lat, lng: shipment.sender_lng },
    { key: 'current', label: 'Last recorded location', place: shipment.current_location || shipment.location, lat: shipment.current_lat, lng: shipment.current_lng },
    { key: 'destination', label: 'Destination', place: shipment.recipient_address, lat: shipment.recipient_lat, lng: shipment.recipient_lng },
  ].filter((point) => point.place || hasCoordinates(point.lat, point.lng))
  const pins = points.map((point) => ({
    ...point,
    coords: hasCoordinates(point.lat, point.lng) ? [Number(point.lat), Number(point.lng)] : null,
  }))
  const mapPoints = pins.filter((point) => point.coords)
  const mapUrl = mapPoints.length
    ? `https://www.openstreetmap.org/?${new URLSearchParams({ bbox: `${Math.min(...mapPoints.map((point) => point.coords[1])) - 1},${Math.min(...mapPoints.map((point) => point.coords[0])) - 1},${Math.max(...mapPoints.map((point) => point.coords[1])) + 1},${Math.max(...mapPoints.map((point) => point.coords[0])) + 1}`, marker: mapPoints.find((point) => point.key === 'current')?.coords.join(',') || mapPoints[0].coords.join(',') })}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(pins.find((point) => point.key === 'current')?.place || pins.at(-1)?.place || '')}`
  const routeLabel = [pins.find((point) => point.key === 'origin')?.place, pins.find((point) => point.key === 'destination')?.place].filter(Boolean).join(' → ')

  return <section className="shipment-map-card" aria-label="Shipment route overview">
    <div className="shipment-map-heading">
      <div>
        <span className="shipment-map-eyebrow">ROUTE OVERVIEW</span>
        <h3>{routeLabel || 'Shipment locations will appear here when available'}</h3>
      </div>
      <a href={mapUrl} target="_blank" rel="noreferrer" className="shipment-map-link">Open map ↗</a>
    </div>
    <a className="shipment-map-canvas" href={mapUrl} target="_blank" rel="noreferrer" aria-label={`Open map for shipment ${trackerNumber}`}>
      <div className="shipment-map-grid" aria-hidden="true"/>
      <svg className="shipment-map-route" viewBox="0 0 1000 340" preserveAspectRatio="none" aria-hidden="true"><path d="M 80 260 C 240 220, 290 75, 465 145 S 710 285, 920 90"/><path className="shipment-map-route-dash" d="M 80 260 C 240 220, 290 75, 465 145 S 710 285, 920 90"/></svg>
      <span className="shipment-map-watermark">COASTAL EDGE <small>SHIPMENT VISIBILITY</small></span>
      {pins.map((point, index) => <span key={point.key} className={`shipment-map-pin ${point.key}`} style={{ left: `${12 + index * (76 / Math.max(pins.length - 1, 1))}%`, top: `${point.key === 'origin' ? '74%' : point.key === 'destination' ? '27%' : '44%'}` }}><i>{point.key === 'origin' ? '1' : point.key === 'destination' ? '3' : '2'}</i><b>{point.label}</b><small>{point.place || 'Coordinates available'}</small></span>)}
      {!pins.length && <span className="shipment-map-empty">The route will appear here when location details are added.</span>}
    </a>
    <div className="shipment-map-foot">
      <span><i/> Illustrative route only. Locations come from shipment records, not live GPS.</span>
      <span>{mapPoints.length ? 'Map markers use the coordinates provided.' : 'Open map searches the recorded shipment location.'}</span>
    </div>
  </section>
}

function ShipmentUpdates({ updates }) {
  return <section className="shipment-updates" aria-labelledby="shipment-updates-title">
    <div className="shipment-section-heading">
      <div>
        <span className="shipment-section-eyebrow">MOVEMENT HISTORY</span>
        <h3 id="shipment-updates-title">Tracking updates</h3>
      </div>
      <span className="shipment-update-count">{updates.length} {updates.length === 1 ? 'update' : 'updates'}</span>
    </div>
    {updates.length ? <ol className="shipment-timeline">
      {[...updates].reverse().map((update, index) => <li className="shipment-timeline-item" key={update.id || `${update.created_at}-${index}`}>
        <span className="shipment-timeline-marker" aria-hidden="true"/>
        <div className="shipment-timeline-content">
          <div className="shipment-timeline-meta">
            <time>{formatDate(update.created_at, true) || 'Time not provided'}</time>
            {update.location && <span>{update.location}</span>}
          </div>
          <p>{update.update_message || 'Shipment status updated.'}</p>
        </div>
      </li>)}
    </ol> : <p className="shipment-timeline-empty">There are no individual tracking updates yet. This page will show new events when they are added.</p>}
  </section>
}

export default function Tracking({ initialNumber }) {
  const [number, setNumber] = useState(initialNumber || '')
  const [shipment, setShipment] = useState(null)
  const [message, setMessage] = useState('Enter your tracking number to see the latest shipment details.')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event?.preventDefault()
    if (!number.trim()) return

    setLoading(true)
    setShipment(null)
    setMessage('Looking up your shipment…')
    try {
      setShipment(await trackShipment(number))
      setMessage('Tracking details loaded.')
    } catch (error) {
      setMessage(error.status === 404
        ? 'We couldn’t find that tracking number. Check it and try again.'
        : `${error.message} Check the API connection and try again.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialNumber) {
      const timer = window.setTimeout(() => submit(), 0)
      return () => window.clearTimeout(timer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const status = shipment ? formatStatus(shipment.status) : null
  const statusKey = String(shipment?.status || 'in_progress').toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return <>
    <PageHero crumbs={['Track a shipment']} eyebrow="YOUR SHIPMENT, IN VIEW" title={<>A little more clarity<br/><em>along the way.</em></>} description="Enter the tracking number shared by our team to see the latest shipment details."/>
    <section className="page-content section-shell">
      <form className="track-page-form" onSubmit={submit}>
        <label htmlFor="tracking-page-input">TRACKING NUMBER</label>
        <div className="track-input track-input-light">
          <input id="tracking-page-input" value={number} onChange={(event) => setNumber(event.target.value)} placeholder="e.g. AAE1-12-0000000001" required/>
          <button type="submit" disabled={loading} aria-label="Find shipment">{loading ? <span className="loading"/> : '→'}</button>
        </div>
        <p className="form-note" role="status" aria-live="polite">{message}</p>
      </form>

      {shipment && <article className="track-result active" aria-labelledby="shipment-result-title">
        <header className="track-result-header">
          <div>
            <span className="shipment-section-eyebrow">SHIPMENT TRACKING</span>
            <h2 id="shipment-result-title">Your shipment</h2>
            <p className="shipment-tracking-number">Tracking number <strong>{shipment.tracker_number || number}</strong></p>
          </div>
          <span className={`tracking-status status-${statusKey}`}>{status.label}</span>
        </header>

        <section className={`shipment-status-panel status-panel-${statusKey}`} aria-label="Current shipment status">
          <span className="shipment-status-icon" aria-hidden="true">{statusKey === 'delivered' ? '✓' : '↗'}</span>
          <div>
            <h3>{status.label}</h3>
            <p>{status.description}</p>
          </div>
        </section>

        <section className="shipment-details" aria-label="Shipment details">
          <div className="shipment-detail-card">
            <span className="shipment-detail-icon" aria-hidden="true">⌖</span>
            <div><small>LAST RECORDED LOCATION</small><strong>{shipment.current_location || shipment.location || 'Location not updated yet'}</strong></div>
          </div>
          <div className="shipment-detail-card">
            <span className="shipment-detail-icon" aria-hidden="true">▦</span>
            <div><small>ESTIMATED DELIVERY</small><strong>{formatDate(shipment.delivery_date) || 'Date to be confirmed'}</strong></div>
          </div>
          <div className="shipment-detail-card">
            <span className="shipment-detail-icon" aria-hidden="true">➜</span>
            <div><small>SHIPPED OUT</small><strong>{formatDate(shipment.shipped_out_date) || 'Not recorded yet'}</strong></div>
          </div>
        </section>

        <ShipmentMap shipment={shipment} trackerNumber={shipment.tracker_number || number}/>

        {shipment.package_information && <section className="shipment-notes">
          <span className="shipment-section-eyebrow">ADDITIONAL INFORMATION</span>
          <h3>About this shipment</h3>
          <p>{shipment.package_information}</p>
        </section>}

        <ShipmentUpdates updates={shipment.updates || []}/>
      </article>}
    </section>
  </>
}
