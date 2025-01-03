import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  image: string;
  url: string;
  description: string;
  notfound?: boolean;
  noindex?: boolean;
};

export default function OpenGraph(props: Props): React.ReactElement {
  const url = import.meta.env.VITE_URL
    ? import.meta.env.VITE_URL
    : window.location.origin;

  const title = `${import.meta.env.DEV ? "🔧" : ""}${import.meta.env.VITE_EXPERIMENTAL == "true" ? "🧪 " : ""}${props.title}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:image" content={`${url}/${props.image}`} />
      <meta property="og:url" content={`${url}/${props.url}`} />
      <meta property="og:description" content={props.description} />
      <meta name="description" content={props.description} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={`${url}/${props.url}`} />
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
