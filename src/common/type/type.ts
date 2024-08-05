export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type ErrorResponse = {
	error: string;
};
type SuccessResponse<Response> = {
	response: Response;
};
export type ApiResponse<Response> = SuccessResponse<Response> | ErrorResponse;
