
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import CurrencySettings from '../pages/inventory/components/CurrencySettings';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;