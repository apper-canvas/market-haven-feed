import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"));
const Cart = lazy(() => import("@/components/pages/Cart"));
const Wishlist = lazy(() => import("@/components/pages/Wishlist"));
const Checkout = lazy(() => import("@/components/pages/Checkout"));
const Orders = lazy(() => import("@/components/pages/Orders"));
const Search = lazy(() => import("@/components/pages/Search"));
const Category = lazy(() => import("@/components/pages/Category"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "product/:id",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ProductDetail />
      </Suspense>
    ),
  },
  {
    path: "cart",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Cart />
      </Suspense>
    ),
  },
  {
    path: "wishlist",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Wishlist />
      </Suspense>
    ),
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: "orders",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Orders />
      </Suspense>
    ),
  },
  {
    path: "search",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Search />
      </Suspense>
    ),
  },
  {
    path: "category/:categoryName",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <Category />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    ),
  },
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes,
  },
];

export const router = createBrowserRouter(routes);