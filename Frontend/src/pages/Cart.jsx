import React from "react";
import Header from "../components/Header";
import pachali from "../assets/images/pachali.png";

function Cart() {
  return (
    <>
      <Header />
      <section className="mt-7">
        <div className="container flex justify-center px-10 max-sm:px-3">
          <div className="flex flex-wrap gap-x-12 gap-y-10 max-lg:flex-col">
            <div className="p-12 rounded-[32px] shadow-3xl">
              <strong className="mb-5">Cart</strong>
              <div className="flex flex-col gap-y-16 flex-wrap">
                <div className="flex flex-wrap gap-x-12 gap-y-2">
                  <img
                    src={pachali}
                    alt="Pachali Bhairav"
                    width={252}
                    height={250}
                    loading="lazy"
                  />
                  <div className="[&_small]:mb-5 md:[&_small]:mb-12 [&_p]:mb-5 md:[&_p]:mb-12 sm:mr-8">
                    <strong>Shree Pachali Bhairav</strong>
                    <small>By Rashi Maharjan</small>
                    <p className="text-dark font-bold text-lg">Rs. 80,000 </p>
                    <a
                      href="#"
                      className="px-5 py-2 bg-grey rounded-[22px] text-black text-base font-medium whitespace-nowrap"
                    >
                      Check Out
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-12 gap-y-2">
                  <img
                    src={pachali}
                    alt="Pachali Bhairav"
                    width={252}
                    height={250}
                    loading="lazy"
                  />
                  <div className="[&_small]:mb-5 md:[&_small]:mb-12 [&_p]:mb-5 md:[&_p]:mb-12 sm:mr-8">
                    <strong>Shree Pachali Bhairav</strong>
                    <small>By Rashi Maharjan</small>
                    <p className="text-dark font-bold text-lg">Rs. 80,000 </p>
                    <a
                      href="#"
                      className="px-5 py-2 bg-grey rounded-[22px] text-black text-base font-medium whitespace-nowrap"
                    >
                      Check Out
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-12 gap-y-2">
                  <img
                    src={pachali}
                    alt="Pachali Bhairav"
                    width={252}
                    height={250}
                    loading="lazy"
                  />
                  <div className="[&_small]:mb-5 md:[&_small]:mb-12 [&_p]:mb-5 md:[&_p]:mb-12 sm:mr-8">
                    <strong>Shree Pachali Bhairav</strong>
                    <small>By Rashi Maharjan</small>
                    <p className="text-dark font-bold text-lg">Rs. 80,000 </p>
                    <a
                      href="#"
                      className="px-5 py-2 bg-grey rounded-[22px] text-black text-base font-medium whitespace-nowrap"
                    >
                      Check Out
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-12 gap-y-2">
                  <img
                    src={pachali}
                    alt="Pachali Bhairav"
                    width={252}
                    height={250}
                    loading="lazy"
                  />
                  <div className="[&_small]:mb-5 md:[&_small]:mb-12 [&_p]:mb-5 md:[&_p]:mb-12 sm:mr-8">
                    <strong>Shree Pachali Bhairav</strong>
                    <small>By Rashi Maharjan</small>
                    <p className="text-dark font-bold text-lg">Rs. 80,000 </p>
                    <a
                      href="#"
                      className="px-5 py-2 bg-grey rounded-[22px] text-black text-base font-medium whitespace-nowrap"
                    >
                      Check Out
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-12 gap-y-2">
                  <img
                    src={pachali}
                    alt="Pachali Bhairav"
                    width={252}
                    height={250}
                    loading="lazy"
                  />
                  <div className="[&_small]:mb-5 md:[&_small]:mb-12 [&_p]:mb-5 md:[&_p]:mb-12 sm:mr-8">
                    <strong>Shree Pachali Bhairav</strong>
                    <small>By Rashi Maharjan</small>
                    <p className="text-dark font-bold text-lg">Rs. 80,000 </p>
                    <a
                      href="#"
                      className="px-5 py-2 bg-grey rounded-[22px] text-black text-base font-medium whitespace-nowrap"
                    >
                      Check Out
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-12 bg-grey-100 lg:mt-28 max-h-[500px] [&_strong]:mb-5 rounded-lg [&_p]:mb-1 [&_p]:text-base [&_p]:font-semibold [&_p]:text-dark [&_span]:font-normal">
              <div>
                <strong>Invoice</strong>
                <p>
                  Total: <span>Rs. 1,40,000</span>
                </p>
                <p>
                  Discount: <span>Rs. 0</span>
                </p>
                <p>
                  Delivery Fee: <span>Rs. 0</span>
                </p>
                <p>
                  Estimated Total: <span>Rs. 1.40.000</span>
                </p>
              </div>
              <div>
                <strong className="mt-12">Payment Method</strong>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="accent-black"
                    name="payment"
                    checked
                  />
                  <label htmlFor="#">Cash on Delivery</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" className="accent-black" name="payment" />
                  <label htmlFor="#">Bank Transfer</label>
                </div>
              </div>
              <a
                href="#"
                className="px-20 py-2 text-center block mt-12 bg-black rounded-[22px] text-white text-base font-medium whitespace-nowrap"
              >
                <span>Order</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
