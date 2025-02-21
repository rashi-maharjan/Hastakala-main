import Header from "../components/Header";
import shree from "../assets/images/Shree Pachali Bhairav.png";
import rashi from '../assets/images/Rashi-big.png'

export default function Details() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header />
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-28 py-8">
        <a
          href="/products"
          className="mb-6 inline-flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 12H18"
              stroke="#000D26"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.6 15.6L6 12L9.6 8.40002"
              stroke="#000D26"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </a>

        <div className="grid gap-8 md:grid-cols-2 rounded-[32px] p-12 shadow-[0px_1px_20px_0px_rgba(0,0,0,0.10)]">
          {/* Product Image */}
          <div className="aspect-auto overflow-hidden rounded-lg bg-gray-100">
            <img
              src={shree}
              alt="Shree Pachali Bhairav artwork"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shree Pachali Bhairav
              </h1>
              <p className="mt-1 text-lg text-gray-600">Surrealist Art</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <img
                  src={rashi}
                  alt="Artist"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">Rashi Maharjan</h3>
                <p className="text-sm text-gray-600">Artist</p>
              </div>
            </div>

            <div className="w-fit rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              In Stock
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-gray-600">Height:</span>
                <span className="font-medium">15 cm</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Width:</span>
                <span className="font-medium">10 cm</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Medium:</span>
                <span className="font-medium">Acrylic</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Paper:</span>
                <span className="font-medium">Water pad</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Orientation:</span>
                <span className="font-medium">Portrait</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Frame:</span>
                <span className="font-medium">Not Included</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">Rs. 80,000</span>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-medium">Description</h3>
              <p className="text-gray-600">
                This is the painting of holy dance of Shree Pachali Bhairav
                which is performed once in twelve years and know as "12 barsa
                khadga siddhi jatra: Gaathu Pyankhan".
              </p>
            </div>

            <button className="w-full rounded-[22px] bg-[#e90303] px-4 py-2 text-white hover:bg-[#e90303]/90 focus:outline-none focus:ring-2 focus:ring-[#e90303]/50">
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
