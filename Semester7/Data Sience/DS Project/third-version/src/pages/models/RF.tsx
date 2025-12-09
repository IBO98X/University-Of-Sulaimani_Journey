import ModelPage from "./ModelPage";

export default function RF() {
  return (
    <ModelPage
      modelId="rf"
      title="Ensemble Model — Random Forest"
      description="An ensemble of decision trees trained on random subsets of data and features. Robust to overfitting and strong baseline for tabular features."
    />
  );
}
