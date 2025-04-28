"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIcpAuth } from "@/hooks/use-icp-auth";
import type { PredictInput } from "@/types/predict-type";

export default function PredictionPage() {
  const { login, logout, whoami, principal, isAuthenticated, authClientReady, actor } = useIcpAuth();

  const [formData, setFormData] = useState<PredictInput>({
    latitude: 0,
    longitude: 0,
    averageScore: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted form data:', formData);

    if (!actor) {
      console.error('Actor belum siap');
      alert('Actor belum siap. Silakan login terlebih dahulu.');
      return;
    }

    try {
      const result = await actor.predict(formData);
      console.log('Predict result from canister:', result);
      alert('Success: ' + result);
    } catch (error) {
      console.error('Failed to predict:', error);
      alert('Error: ' + (error as Error).message);
    }
  };

  return (
    <>
      <div className="p-4 space-y-4">
        {/* ICP Auth Section */}
        {!isAuthenticated ? (
          <Button onClick={login} disabled={!authClientReady}>
            {authClientReady ? "Connect to Internet Identity" : "Loading ICP..."}
          </Button>
        ) : (
          <Button onClick={logout}>
            Disconnect ICP
          </Button>
        )}

        <Button onClick={whoami} disabled={!isAuthenticated}>
          Who Am I on ICP?
        </Button>

        {principal && (
          <div className="mt-4">
            <div>Your ICP Principal ID:</div>
            <div className="font-mono text-sm">{principal}</div>
          </div>
        )}
      </div>

      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Predict Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Latitude</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="0.00001"
              className="w-full p-2 border rounded"
              required
              min={-90}
              max={90}
            />
          </div>

          <div>
            <label className="block mb-1">Longitude</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="0.00001"
              className="w-full p-2 border rounded"
              required
              min={-180}
              max={180}
            />
          </div>

          <div>
            <label className="block mb-1">Average Score</label>
            <input
              type="number"
              name="averageScore"
              value={formData.averageScore}
              onChange={handleChange}
              step="0.01"
              className="w-full p-2 border rounded"
              required
              min={0}
              max={100}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}
