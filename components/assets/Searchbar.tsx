"use client";

import * as React from "react";
import { SVGProps } from "react";
const SearchBarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.6666 11.6667L14.6666 14.6667"
      stroke="#CDE2DB"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.3334 7.33325C13.3334 4.01955 10.6471 1.33325 7.33337 1.33325C4.01967 1.33325 1.33337 4.01955 1.33337 7.33325C1.33337 10.647 4.01967 13.3333 7.33337 13.3333C10.6471 13.3333 13.3334 10.647 13.3334 7.33325Z"
      stroke="#CDE2DB"
      strokeWidth={1.25}
      strokeLinejoin="round"
    />
  </svg>
);
export default SearchBarIcon;
