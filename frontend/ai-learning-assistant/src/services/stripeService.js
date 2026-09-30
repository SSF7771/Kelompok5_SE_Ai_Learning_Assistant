import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

export const createStripeCheckoutSession = async (tokenAmount, priceInUSD) => {
  try {
    const response = await axiosInstance.post(API_PATHS.STRIPE.CREATE_CHECKOUT, {
      tokenAmount,
      priceInUSD,
    });

    return response.data; 
    // Expected to contain { url: "https://checkout.stripe.com/..." }
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred while creating the checkout session!",
      }
    );
  }
};

export const claimTokens = async (tokens) => {
  try {
    const response = await axiosInstance.post(API_PATHS.STRIPE.CLAIM_TOKENS, {
      tokens,
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred while claiming tokens!",
      }
    );
  }
};