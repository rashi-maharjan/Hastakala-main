import React from "react";
import Header from "../components/Header";
import first_img from "../assets/images/event-feature-image-1.png";
import sec_img from "../assets/images/event-feature-image-2.png";
import third_img from "../assets/images/event-feature-image-3.png";

function Events() {
  return (
    <>
      <Header />
      <section className="px-5 sm:px-10 md:px-20 lg:px-40 xl:px-56 py-8">
        <div className="container">
          <div className="flex justify-end">
            <a
              href="#"
              className="gap-2 px-5 py-2 bg-primary rounded-[22px] text-white whitespace-nowrap"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              <span>Add Event</span>
            </a>
          </div>
          <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-3 gap-10">
            <div className="text-dark">
              <img src={first_img} alt="Feature Image 1" className="w-full object-cover"/>
              <div className="mt-5 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">
                  Deities of Nepal Exhibition
                </h3>
                <p className="text-base font-normal">Nov 27, 2022 - Dec 11, 2022</p>
                <p className="text-base font-normal">10:00 AM - 5:00 PM</p>
                <p className="text-base font-normal">Nepal Art Council, Babarmahal</p>
              </div>
            </div>
            <div className="text-dark">
              <img src={sec_img} alt="Feature Image 1"  className="w-full object-cover"/>
              <div className="mt-5 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">
                Deities of Nepal II Exhibition
                </h3>
                <p className="text-base font-normal">May 21, 2024 - Jun 10, 2024</p>
                <p className="text-base font-normal">10:00 AM - 5:00 PM</p>
                <p className="text-base font-normal">Nepal Art Council, Babarmahal</p>
              </div>
            </div>
            <div className="text-dark">
              <img src={third_img} alt="Feature Image 1"  className="w-full object-cover"/>
              <div className="mt-5 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">
                Workshop : Preservation of Contemporary Paubha & Thangka
                </h3>
                <p className="text-base font-normal">Sep 17, 2024 </p>
                <p className="text-base font-normal">11:00 AM - 4:00 PM</p>
                <p className="text-base font-normal">Taragaon Next, Boudha</p>
              </div>
            </div>
            <div className="text-dark">
              <img src={sec_img} alt="Feature Image 1"  className="w-full object-cover"/>
              <div className="mt-5 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">
                Workshop : Preservation of Contemporary Paubha & Thangka
                </h3>
                <p className="text-base font-normal">Sep 17, 2024 </p>
                <p className="text-base font-normal">11:00 AM - 4:00 PM</p>
                <p className="text-base font-normal">Taragaon Next, Boudha</p>
              </div>
            </div>
            <div className="text-dark">
              <img src={third_img} alt="Feature Image 1"  className="w-full object-cover"/>
              <div className="mt-5 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">
                Workshop : Preservation of Contemporary Paubha & Thangka
                </h3>
                <p className="text-base font-normal">Sep 17, 2024 </p>
                <p className="text-base font-normal">11:00 AM - 4:00 PM</p>
                <p className="text-base font-normal">Taragaon Next, Boudha</p>
              </div>
            </div>
            <div className="text-dark">
              <img src={third_img} alt="Feature Image 1"  className="w-full object-cover"/>
              <div className="mt-5 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">
                Workshop : Preservation of Contemporary Paubha & Thangka
                </h3>
                <p className="text-base font-normal">Sep 17, 2024 </p>
                <p className="text-base font-normal">11:00 AM - 4:00 PM</p>
                <p className="text-base font-normal">Taragaon Next, Boudha</p>
              </div>
            </div>
            <div className="text-dark">
              <img src={third_img} alt="Feature Image 1"  className="w-full object-cover"/>
              <div className="mt-5 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">
                Workshop : Preservation of Contemporary Paubha & Thangka
                </h3>
                <p className="text-base font-normal">Sep 17, 2024 </p>
                <p className="text-base font-normal">11:00 AM - 4:00 PM</p>
                <p className="text-base font-normal">Taragaon Next, Boudha</p>
              </div>
            </div>
            <div className="text-dark">
              <img src={third_img} alt="Feature Image 1"  className="w-full object-cover"/>
              <div className="mt-5 flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">
                Workshop : Preservation of Contemporary Paubha & Thangka
                </h3>
                <p className="text-base font-normal">Sep 17, 2024 </p>
                <p className="text-base font-normal">11:00 AM - 4:00 PM</p>
                <p className="text-base font-normal">Taragaon Next, Boudha</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default Events;
