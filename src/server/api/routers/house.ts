import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import process from "process";

type HouseDetailsResponse = {
  property_id: string;
  status: string;
  baths: number;
  beds: number;
  garage: number;
  sqft: number;
  lot_sqft: number;
  stories: number;
  text: string;
  year_built: number;
  styles: [string];
  list_price: number;
  price_per_sqft: number;
  address: { line: string; city: string; state: string; postal_code: string };
};

export const houseRouter = createTRPCRouter({
  searchHouse: publicProcedure
    .input(z.object({ stAddress: z.string() }))
    .mutation(async ({ input }) => {
      // replace with your own real estate API

      const options = {
        method: "GET",
        url: process.env.HOUSE_DATA_API_URL,
        params: {
          input: `${input.stAddress}`,
        },
        headers: {
          PrunedKey: process.env.HOUSE_DATA_API_KEY,
          PrunedType: "Type",
        },
      } as AxiosRequestConfig;

      const response: AxiosResponse = await axios.request(options);

      // error check here to make sure the response was successful

      // enrich it with more data
      // again add your own API here

      const moreOptions = {
        method: "GET",
        url: "https://pruned.com/",
        // params: { input: response.data.id},
        headers: {
          PrunedKey: process.env.HOUSE_DATA_API_KEY,
          PrunedType: "Type",
        },
      } as AxiosRequestConfig;

      const anotherResponse: AxiosResponse = await axios.request(moreOptions);
      return anotherResponse.data as HouseDetailsResponse;

      // format for returning to client
    }),
});
