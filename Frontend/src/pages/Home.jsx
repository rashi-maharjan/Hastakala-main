import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section
      className="backdrop-blur-3xl h-screen overflow-hidden flex justify-center relative before:absolute before:left-[50%] before:top-[20%] 2xl:before:top-[30%]
     before:bg-primary/80 before:rounded-full before:size-[15%] 2xl:before:size-[15%] before:-z-[1] before:blur-[105px] after:absolute after:right-[%] after:top-[70%] 2xl:after:top-[60%] after:bg-red-600 after:rounded-full after:size-[15%] 2xl:after:size-[15%] after:-z-[1] after:blur-[105px]"
    >
      <div className="container z-[10] relative before:absolute before:right-[55%] before:top-[30%] 2xl:before:top-[35%] before:bg-green-500 before:rounded-full before:size-[15%] 2xl:before:size-[15%] before:-z-[1] before:blur-[105px]">
      {/* Navigation */}
      <nav className="p-6 flex justify-end">
        <Link to='/login' className="bg-black text-white hover:bg-black/90 rounded-full px-6 py-2 text-sm font-medium transition-colors">
          Sign In
        </Link>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 text-center pt-16 md:pt-24 max-w-[800px]">
        {/* Logo */}
        <div className="mb-16 flex justify-center items-center">
          <img src={logo} alt="Logo" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight mb-8">
          Where Creativity Meets Community – Discover, Sell, and Celebrate Art.
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Hastakala is a platform where artists can showcase and sell their creations while connecting with art
          enthusiasts. Discover, buy, and discuss art, and stay updated on exhibitions and art events, all in one place!
        </p>

        {/* CTA Button */}
        <Link to='/register' className="bg-[#3072E3] hover:bg-[#3072E3]/60 border-none outline-none text-white rounded-[22px] px-5 py-3 text-lg font-medium transition-colors">
          Get Started
        </Link>
      </main>
    </div>
    </section>
    
  )
}

export default Home

