export enum Status {
	Idle = 'idle',
	Loading = 'loading',
	Succeeded = 'succeeded',
	Failed = 'failed',
}

type ErrorResponse = {
	error: string;
};
type SuccessResponse<Response> = {
	response: Response;
};
export type ApiResponse<Response> = SuccessResponse<Response> | ErrorResponse;
