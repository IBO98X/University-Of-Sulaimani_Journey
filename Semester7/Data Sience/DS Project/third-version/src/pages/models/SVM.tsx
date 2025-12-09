import ModelPage from "./ModelPage";

export default function SVM() {
  return (
    <ModelPage
      modelId="svm"
      title="Kernel-Based Model — Support Vector Machine"
      description="Finds a maximum-margin hyperplane to separate classes; with kernels it captures non-linear boundaries in higher-dimensional spaces."
    />
  );
}
