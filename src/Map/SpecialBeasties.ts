import { latLng, LatLng } from "leaflet";

export const EXTINCT_BEASTIES: { beastieId: string; position: LatLng }[] = [
  {
    beastieId: "platypus",
    position: latLng(-7294, -56833),
  },
  {
    beastieId: "bestiemon",
    position: latLng(4521, -7366),
  },
  {
    beastieId: "cheerleadermon",
    position: latLng(44664, -11953),
  },
  {
    beastieId: "magpiemon",
    position: latLng(7326, -16996),
  },
  {
    beastieId: "rainbowmon",
    position: latLng(-48731, -27263),
  },
];

export const METAMORPH_LOCATIONS: {
  from: string;
  to: string;
  by: string;
  position: LatLng;
}[] = [
  {
    from: "shroom1",
    to: "shroom_b",
    by: "sprecko",
    position: latLng(7298, -11348),
  },
  {
    from: "shroom1",
    to: "shroom_s",
    by: "sprecko",
    position: latLng(-36448, -47526),
  },
  {
    from: "shroom1",
    to: "shroom_m",
    by: "sprecko",
    position: latLng(39000, -28655),
  },
  {
    from: "tricky1",
    to: "tricky",
    by: "troglum",
    position: latLng(34366, -15454),
  },
];
