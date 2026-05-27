import debounce from "debounce";

import {alert, notice, info, success, error, defaultModules,} 
from "@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "@pnotify/mobile/dist/PNotifyMobile.js";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/core/dist/PNotify.css";
import { delay } from "lodash";
defaultModules.set(PNotifyMobile, {});

const inputEl = document.querySelector(".input");
const listEl = document.querySelector(".countries");

let search = "";

function getCountry(search) {
  return fetch(`https://restcountries.com/v3.1/name/${search}`).then((res) => res.json())
}

inputEl.addEventListener(
  "input",
  debounce((e) => {
    search = e.target.value.trim().toLowerCase();

    getCountry(search).then((res) => {
      if (res.length > 10) {
        alert({
          text: "необхідно зробити запит більш специфічним",
          delay: 1000,
        });
        return;
      }

      if (res.length > 2 && res.length <= 10) {
        const fewCountries = res
          .map((elem) => {
            return `<li>${elem.name.common}</li>`;
          })
          .join("");

        listEl.innerHTML = fewCountries;
        return;
      }

      if (!res.length) {
        alert({ text: "Введіть країну", delay: 1000 });
      }

      uploadCountry(res);
    });
  }, 500),
);

function uploadCountry(arr) {
  const item = arr
    .map((elem) => {
      const languages = Object.values(elem.languages);
      return `<li>
                    <h2>${elem.name.common}</h2>
                    <img src="${elem.flags.png}" alt="${elem.flags.alt}">
                    <p>Capital: ${elem.capital}</p>
                    <p>Population: ${elem.population}</p>
                    <p>Official language: ${languages}</p>
                </li>`;
    })
    .join("");
  listEl.innerHTML = item;
}
