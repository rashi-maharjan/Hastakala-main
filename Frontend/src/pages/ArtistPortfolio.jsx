import Header from "../components/Header";
import rashi from '../assets/images/Rashi-big.png'
import peace from '../assets/images/Peace and Harmony.png'
import living from '../assets/images/Living Goddess.png'
import seto from '../assets/images/Holy Seto Machhindranath.png'
import culture from '../assets/images/Culture behind the Mask.png'
import ganesh from '../assets/images/Ganesh of Navadurga Nach.png'
import shree from '../assets/images/Shree Pachali Bhairav.png'

function ArtistPortfolio() {
  const products = [
    {
      title: "Peace and Harmony",
      price: "Rs. 30,000",
      image: peace,
    },
    {
      title: "Living Goddess",
      price: "Rs. 50,000",
      image:
        living
    },
    {
      title: "Holy Seto Machhindranath",
      price: "Rs. 40,000",
      image:
        seto
    },
    {
      title: "Culture behind the Mask",
      price: "Rs. 60,000",
      image:
        culture
    },
    {
      title: "Ganesh of Navadurga Nach",
      price: "Rs. 10,000",
      image:
        ganesh
    },
    {
      title: "Shree Pachali Bhairav",
      price: "Rs. 80,000",
      image:
        shree
    },
  ];

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative h-16 w-16">
            <img
              src={rashi}
              alt="Profile picture"
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <div className="mr-10">
            <h1 className="text-xl font-semibold">Rashi Maharjan</h1>
            <p className="text-gray-600">rashimaharjan03@gmail.com</p>
          </div>
          <button className="bg-[#D9D9D9] px-4 py-2 text-sm rounded-[22px] hover:bg-[#dfdfdf]">
            Edit Profile
          </button>
        </div>

        {/* Products Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Products</h2>
          <a
              href="#"
              className="gap-2 px-5 py-2 bg-primary rounded-[22px] text-white whitespace-nowrap"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              <span>Add Product</span>
            </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{product.title}</h3>
                <p className="text-gray-600">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ArtistPortfolio;