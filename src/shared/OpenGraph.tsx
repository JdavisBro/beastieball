import { Helmet } from "react-helmet-async";
import useLocalization from "../localization/useLocalization";

type Props = {
  title: string;
  image: string;
  url: string;
  description: string;
  notfound?: boolean;
  noindex?: boolean;
};

export default function OpenGraph(props: Props): React.ReactElement {
  const { getLink } = useLocalization();

  const url = import.meta.env.VITE_URL
    ? import.meta.env.VITE_URL
    : window.location.origin;

  const title = `${import.meta.env.DEV ? "🔧" : ""}${import.meta.env.VITE_EXPERIMENTAL == "true" ? "🧪 " : ""}${props.title}`;
  const link = url + getLink("/" + props.url);
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:image" content={`${url}/${props.image}`} />
      <meta property="og:url" content={link} />
      <meta property="og:description" content={props.description} />
      <meta name="description" content={props.description} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={link} />
      <meta name="twitter:card" content="summary" />
      <meta
        name="prerender-status-code"
        content={props.notfound ? "404" : "200"}
      ></meta>
      <meta
        name="robots"
        content={
          props.noindex || import.meta.env.VITE_EXPERIMENTAL == "true"
            ? "noindex"
            : ""
        }
      />
    </Helmet>
  );
}
