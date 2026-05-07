export type BackendError = {
  message: string;
  details?: {
    formErrors: string[];
    fieldErrors: Record<string, string[] | undefined>;
  };
};

export type CreateShiftInput = {
  start_time: Date;
  end_time: Date;
  patient_id: number;
  caregiver_id: number;
};
