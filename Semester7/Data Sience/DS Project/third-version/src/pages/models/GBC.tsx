import ModelPage from "./ModelPage";

export default function GBC() {
  return (
    <ModelPage
      modelId="gbc"
      title="Tree-Based Model — Gradient Boosting Classifier"
      description="An ensemble built sequentially where each new tree corrects the errors of the previous ones, often achieving high accuracy on structured data."
    />
  );
}
