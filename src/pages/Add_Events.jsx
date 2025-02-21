import React from "react";
import Header from "../components/Header";

function Add_Events() {
  return (
    <>
      <Header />
      <section>
        <div className="container flex py-12 px-3 sm:px-6 md:px-10 lg:px-28">
          <div className="w-2/5 rounded-[32px] shadow-3xl py-24 px-12 flex flex-col justify-center items-center gap-7">
            <p className="font-semibold">Add image</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
            >
              <path
                d="M36.8333 6.5H15.1667C10.3802 6.5 6.5 10.3802 6.5 15.1667V36.8333C6.5 41.6198 10.3802 45.5 15.1667 45.5H36.8333C41.6198 45.5 45.5 41.6198 45.5 36.8333V15.1667C45.5 10.3802 41.6198 6.5 36.8333 6.5Z"
                stroke="#000D26"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.5 36.8333L14.2783 29.055C15.0902 28.2479 16.1885 27.7949 17.3333 27.7949C18.4781 27.7949 19.5764 28.2479 20.3883 29.055L25.1117 33.7783C25.9236 34.5854 27.0219 35.0384 28.1667 35.0384C29.3115 35.0384 30.4098 34.5854 31.2217 33.7783L45.5 19.5"
                stroke="#000D26"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <label
              htmlFor="input-file"
              className="bg-primary text-white w-full text-center py-[10px] text-base font-medium rounded-[32px]"
            >
              Select from device
            </label>
            <input
              type="file"
              name="#"
              id="input-file"
              accept="image/png, image/gif, image/jpeg"
              className="hidden"
            />
          </div>
          <div className="w-3/5">
            <form action="#">
              <div>
                <label htmlFor="event-title" className="block mb-3">
                  Event Title
                </label>
                <input
                  type="text"
                  id="event-title"
                  className="block border rounded-[16px] w-full px-5 py-2 outline-none"
                />
              </div>
              <div>
                <label htmlFor="">Start Date</label>
                <input type="date" name="" id="" className="input-date"/>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Add_Events;
