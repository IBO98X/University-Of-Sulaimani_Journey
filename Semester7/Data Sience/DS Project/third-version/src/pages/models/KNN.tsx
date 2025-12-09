import ModelPage from "./ModelPage";

export default function KNN() {
  return (
    <ModelPage
      modelId="knn"
      title="Distance-Based Model — K-Nearest Neighbors"
      description="A non-parametric method that classifies a sample by voting among its K closest neighbors in feature space."
    />
  );
}
