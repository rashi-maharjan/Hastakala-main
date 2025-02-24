import React from "react";

function Button() {
  return (
    <>
      <a
        href="#"
        className="gap-2 px-5 py-2 bg-primary rounded-[22px] text-white whitespace-nowrap"
      >
        <i className="fa-solid fa-plus mr-2"></i>
        <span>Button</span>
      </a>
      <a
        href="#"
        className="px-5 py-2 bg-grey rounded-[22px] text-black text-base font-medium whitespace-nowrap"
      >
        <span>Button</span>
      </a>
    </>
  );
}

export default Button;
