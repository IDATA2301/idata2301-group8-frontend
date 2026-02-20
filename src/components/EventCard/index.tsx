type Props = {
  title: string,
  location: string,
  price: number,
  imageSource: string
  href: string
}

function EventCard(p: Props) {
  return (
    <a href={p.href}>
      <img src={p.imageSource} />
      <h2>{p.title}</h2>
      <p>{p.location}</p>
      <p>From {p.price} NOK</p>
    </a>
  )
}

export default EventCard
