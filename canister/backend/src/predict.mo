// backend/src/predict.mo

module {
  public type PredictInput = {
    latitude: Float;
    longitude: Float;
    averageScore: Float;
  };
};
