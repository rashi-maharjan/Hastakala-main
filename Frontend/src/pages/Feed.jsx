import Header from "../components/Header";
import peace from '../assets/images/Peace and Harmony.png'
import living from '../assets/images/Living Goddess.png'
import seto from '../assets/images/Holy Seto Machhindranath.png'
import culture from '../assets/images/Culture behind the Mask.png'
import ganesh from '../assets/images/Ganesh of Navadurga Nach.png'
import shree from '../assets/images/Shree Pachali Bhairav.png'
import millions from '../assets/images/Millions of Dots.png'
import gufa from '../assets/images/Gufa.png'
import green from '../assets/images/Green Tara.png'
import sop from '../assets/images/Sophisticated Nature.png'

const Feed = () => {
  const artworks = [
    { title: "Peace and Harmony", price: "Rs. 30,000", image: peace },
    { title: "Living Goddess", price: "Rs. 50,000", image: living },
    { title: "Holy Seto Machhindranath", price: "Rs. 40,000", image: seto },
    { title: "Millions of Dots", price: "Rs. 2,000", image: millions},
    { title: "Ganesh of Navadurga Nach", price: "Rs. 10,000", image: ganesh },
    { title: "Culture behind the Mask", price: "Rs. 60,000", image: culture },
    { title: "Shree Pachali Bhairav", price: "Rs. 80,000", image: shree },
    { title: "Gufa", price: "Rs. 10,000", image: gufa },
    { title: "Green Tara", price: "Rs. 2,000", image: green },
    { title: "Sophisticated Nature", price: "Rs. 1,000", image:sop },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold">Most Popular</h2>
          <span className="text-xl"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
  <path d="M22.5 4.375V18.125" stroke="#000D26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22.5 25.625C23.5355 25.625 24.375 24.7855 24.375 23.75C24.375 22.7145 23.5355 21.875 22.5 21.875C21.4645 21.875 20.625 22.7145 20.625 23.75C20.625 24.7855 21.4645 25.625 22.5 25.625Z" stroke="#000D26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15 25.625V11.875" stroke="#000D26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15 8.125C16.0355 8.125 16.875 7.28553 16.875 6.25C16.875 5.21447 16.0355 4.375 15 4.375C13.9645 4.375 13.125 5.21447 13.125 6.25C13.125 7.28553 13.9645 8.125 15 8.125Z" stroke="#000D26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.5 3.75V17.5" stroke="#000D26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7.5 25.625C8.53553 25.625 9.375 24.7855 9.375 23.75C9.375 22.7145 8.53553 21.875 7.5 21.875C6.46447 21.875 5.625 22.7145 5.625 23.75C5.625 24.7855 6.46447 25.625 7.5 25.625Z" stroke="#000D26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {artworks.map((artwork, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-base">{artwork.title}</h3>
                <p className="text-gray-600">{artwork.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Feed

