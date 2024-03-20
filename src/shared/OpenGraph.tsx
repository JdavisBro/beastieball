import { Helmet } from "react-helmet";

type Props = {
  title: string;
  image: string;
  url: string;
  description: string;
};

export default function MoveView(props: Props): React.ReactElement {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta property="og:title" content={props.title} />
      <meta
        property="og:image"
        content={`${import.meta.env.VITE_NETLIFY_URL}/${props.image}`}
      />
      <meta
        property="og:url"
        content={`${import.meta.env.VITE_NETLIFY_URL}/${props.url}`}
      />
      <meta property="og:description" content={props.description} />
    </Helmet>
  );
}
