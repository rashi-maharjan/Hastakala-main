import React from "react";
import Header from "../components/Header";
import rashi from "../assets/images/rashi.png";

function Community() {
  return (
    <>
      <Header />
      <section className="px-5 sm:px-10 md:px-20 lg:px-40 xl:px-56 py-8">
        <div className="container">
          <div className="flex justify-end">
            <a
              href="#"
              className="gap-2 px-5 py-2 bg-primary hover:bg-primary/80 rounded-[22px] text-white whitespace-nowrap"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              <span>Create Post</span>
            </a>
          </div>
          <div className="flex flex-col gap-12 mt-12">
            <div className="flex flex-col gap-10 p-12 r-community ">
              <div className="flex gap-4">
                <img src={rashi} alt="Rashi" className="size-[48px]" />
                <div>
                  <h5 className="text-base font-semibold leading-normal">
                    Rashi Maharjan
                  </h5>
                  <p className="text-sm font-normal">2w</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-6">
                  Which is easier oil painting or acrylic?
                </h3>
                <p className="text-base font-normal leading-6 mt-4">
                  Lorem ipsum dolor sit amet consectetur. Etiam laoreet nibh
                  eget nisi adipiscing sit. Donec nam eu volutpat magna pulvinar
                  in. Eget id ac fermentum sed volutpat. Molestie suspendisse
                  facilisi mattis auctor tortor. Lectus in diam et feugiat
                  tristique. Nisi enim at etiam diam aliquam magna posuere
                  molestie diam. Vestibulum in ornare in porttitor mi habitant
                  dictumst in in. Rhoncus quam congue facilisis volutpat at
                  amet. Ac eget adipiscing risus praesent non sit scelerisque.
                </p>
              </div>
              <div className="flex gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M13.35 5.26005L14.62 7.85005C14.7278 8.06811 14.887 8.25669 15.0838 8.39954C15.2807 8.54239 15.5093 8.63523 15.75 8.67005L18.6 9.08005C18.8772 9.1203 19.1376 9.23734 19.3517 9.41793C19.5658 9.59852 19.725 9.83544 19.8114 10.1019C19.8978 10.3683 19.9078 10.6536 19.8404 10.9254C19.773 11.1973 19.6309 11.4448 19.43 11.6401L17.37 13.6401C17.1904 13.8127 17.0569 14.0277 16.9817 14.2653C16.9066 14.5028 16.8923 14.7555 16.94 15.0001L17.42 17.8401C17.4662 18.115 17.4349 18.3973 17.3295 18.6554C17.2242 18.9135 17.049 19.1371 16.8237 19.3012C16.5983 19.4653 16.3317 19.5633 16.0538 19.5843C15.7758 19.6053 15.4975 19.5484 15.25 19.4201L12.7 18.0601C12.484 17.947 12.2438 17.888 12 17.888C11.7562 17.888 11.5161 17.947 11.3 18.0601L8.75004 19.4001C8.5026 19.5284 8.22428 19.5853 7.94632 19.5643C7.66836 19.5433 7.40174 19.4453 7.17639 19.2812C6.95104 19.1171 6.77587 18.8935 6.67053 18.6354C6.5652 18.3773 6.53386 18.095 6.58004 17.8201L7.06004 15.0001C7.10259 14.7601 7.08565 14.5134 7.01068 14.2815C6.93571 14.0496 6.80501 13.8397 6.63004 13.6701L4.57004 11.6701C4.36019 11.4762 4.21006 11.2264 4.13732 10.9501C4.06458 10.6739 4.07226 10.3825 4.15945 10.1105C4.24663 9.83841 4.40971 9.5969 4.62948 9.41436C4.84926 9.23181 5.11659 9.11583 5.40004 9.08005L8.25004 8.67005C8.49076 8.63523 8.7194 8.54239 8.91626 8.39954C9.11312 8.25669 9.27228 8.06811 9.38004 7.85005L10.65 5.26005C10.7756 5.00954 10.9683 4.7989 11.2067 4.65169C11.4452 4.50448 11.7198 4.42651 12 4.42651C12.2802 4.42651 12.5549 4.50448 12.7933 4.65169C13.0318 4.7989 13.2245 5.00954 13.35 5.26005Z"
                    stroke="#000D26"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7.19995 17.1501C7.20467 16.9161 7.1272 16.6879 6.98102 16.5052C6.83485 16.3225 6.62923 16.1968 6.39995 16.1501C5.76771 15.9751 5.21024 15.5978 4.8129 15.0758C4.41556 14.5539 4.20025 13.916 4.19995 13.2601V7.43005C4.19995 6.6344 4.51602 5.87134 5.07863 5.30873C5.64124 4.74612 6.4043 4.43005 7.19995 4.43005H16.8C17.5956 4.43005 18.3587 4.74612 18.9213 5.30873C19.4839 5.87134 19.8 6.6344 19.8 7.43005V13.2801C19.8 14.0757 19.4839 14.8388 18.9213 15.4014C18.3587 15.964 17.5956 16.2801 16.8 16.2801H11.59C11.3276 16.2812 11.0762 16.3853 10.89 16.5701L8.04995 19.4301C7.97946 19.4992 7.89008 19.5458 7.79309 19.5642C7.69611 19.5826 7.59585 19.5719 7.50495 19.5334C7.41405 19.4949 7.33658 19.4304 7.2823 19.3479C7.22803 19.2654 7.19937 19.1688 7.19995 19.0701V17.1501Z"
                    stroke="#000D26"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  />
                  <path
                    d="M9 10.28V10.29"
                    stroke="#000D26"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 10.28V10.29"
                    stroke="#000D26"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15 10.28V10.29"
                    stroke="#000D26"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-10 p-12 r-community ">
              <div className="flex gap-4">
                <img src={rashi} alt="Rashi" className="size-[48px]" />
                <div>
                  <h5 className="text-base font-semibold leading-normal">
                    Rashi Maharjan
                  </h5>
                  <p className="text-sm font-normal">2w</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-6">
                  Why is it hard to sell art online?
                </h3>
                <p className="text-base font-normal leading-6 mt-4">
                  Lorem ipsum dolor sit amet consectetur. Etiam laoreet nibh
                  eget nisi adipiscing sit. Donec nam eu volutpat magna pulvinar
                  in.
                </p>
              </div>
              <div className="flex gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M13.35 5.26005L14.62 7.85005C14.7278 8.06811 14.887 8.25669 15.0838 8.39954C15.2807 8.54239 15.5093 8.63523 15.75 8.67005L18.6 9.08005C18.8772 9.1203 19.1376 9.23734 19.3517 9.41793C19.5658 9.59852 19.725 9.83544 19.8114 10.1019C19.8978 10.3683 19.9078 10.6536 19.8404 10.9254C19.773 11.1973 19.6309 11.4448 19.43 11.6401L17.37 13.6401C17.1904 13.8127 17.0569 14.0277 16.9817 14.2653C16.9066 14.5028 16.8923 14.7555 16.94 15.0001L17.42 17.8401C17.4662 18.115 17.4349 18.3973 17.3295 18.6554C17.2242 18.9135 17.049 19.1371 16.8237 19.3012C16.5983 19.4653 16.3317 19.5633 16.0538 19.5843C15.7758 19.6053 15.4975 19.5484 15.25 19.4201L12.7 18.0601C12.484 17.947 12.2438 17.888 12 17.888C11.7562 17.888 11.5161 17.947 11.3 18.0601L8.75004 19.4001C8.5026 19.5284 8.22428 19.5853 7.94632 19.5643C7.66836 19.5433 7.40174 19.4453 7.17639 19.2812C6.95104 19.1171 6.77587 18.8935 6.67053 18.6354C6.5652 18.3773 6.53386 18.095 6.58004 17.8201L7.06004 15.0001C7.10259 14.7601 7.08565 14.5134 7.01068 14.2815C6.93571 14.0496 6.80501 13.8397 6.63004 13.6701L4.57004 11.6701C4.36019 11.4762 4.21006 11.2264 4.13732 10.9501C4.06458 10.6739 4.07226 10.3825 4.15945 10.1105C4.24663 9.83841 4.40971 9.5969 4.62948 9.41436C4.84926 9.23181 5.11659 9.11583 5.40004 9.08005L8.25004 8.67005C8.49076 8.63523 8.7194 8.54239 8.91626 8.39954C9.11312 8.25669 9.27228 8.06811 9.38004 7.85005L10.65 5.26005C10.7756 5.00954 10.9683 4.7989 11.2067 4.65169C11.4452 4.50448 11.7198 4.42651 12 4.42651C12.2802 4.42651 12.5549 4.50448 12.7933 4.65169C13.0318 4.7989 13.2245 5.00954 13.35 5.26005Z"
                    stroke="#000D26"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7.19995 17.1501C7.20467 16.9161 7.1272 16.6879 6.98102 16.5052C6.83485 16.3225 6.62923 16.1968 6.39995 16.1501C5.76771 15.9751 5.21024 15.5978 4.8129 15.0758C4.41556 14.5539 4.20025 13.916 4.19995 13.2601V7.43005C4.19995 6.6344 4.51602 5.87134 5.07863 5.30873C5.64124 4.74612 6.4043 4.43005 7.19995 4.43005H16.8C17.5956 4.43005 18.3587 4.74612 18.9213 5.30873C19.4839 5.87134 19.8 6.6344 19.8 7.43005V13.2801C19.8 14.0757 19.4839 14.8388 18.9213 15.4014C18.3587 15.964 17.5956 16.2801 16.8 16.2801H11.59C11.3276 16.2812 11.0762 16.3853 10.89 16.5701L8.04995 19.4301C7.97946 19.4992 7.89008 19.5458 7.79309 19.5642C7.69611 19.5826 7.59585 19.5719 7.50495 19.5334C7.41405 19.4949 7.33658 19.4304 7.2823 19.3479C7.22803 19.2654 7.19937 19.1688 7.19995 19.0701V17.1501Z"
                    stroke="#000D26"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  />
                  <path
                    d="M9 10.28V10.29"
                    stroke="#000D26"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 10.28V10.29"
                    stroke="#000D26"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15 10.28V10.29"
                    stroke="#000D26"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Community;
