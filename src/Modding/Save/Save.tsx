import Header from "../../shared/Header";
import OpenGraph from "../../shared/OpenGraph";
import styles from "./Save.module.css";

export default function Save(): React.ReactElement {
  return (
    <div className={styles.container}>
      <OpenGraph
        title="Beastieball Save Viewer"
        image="gameassets/sprMainmenu/10.png"
        url="modding/save/"
        description="Save Viewer/Editor for Beastieball"
      />
      <Header
        title="Beastieball Save Viewer"
        returnButtonTitle="Beastieball Modding Tools"
        returnButtonTo="/modding/"
      />
      <div className={styles.belowheader}>
        <div style={{ fontSize: "20em" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, minima
          repellendus. Earum veniam quibusdam at eaque sed consectetur accusamus
          ipsum consequatur blanditiis, quisquam et quaerat assumenda. Accusamus
          quod dolor eius pariatur nihil, totam doloremque molestiae perferendis
          quam omnis molestias? Debitis sunt excepturi quam, impedit recusandae
          beatae consectetur nobis quasi modi.
        </div>
      </div>
    </div>
  );
}
