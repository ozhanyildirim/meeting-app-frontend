export interface DocumentResponse {
    id: number;
    fileName: string;
    fileType: string;
    base64Content: string;
    fileSize: number;
    uploadedAt: string;
}

export interface DocumentUpload {
    fileName: string;
    base64Content: string;
}

export interface Meeting {
    id: number;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    isCancelled?: boolean;
    cancelledAt?: string;
    document?: DocumentResponse;
}

export interface CreateMeetingRequest {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    document?: DocumentUpload;
}

export interface UpdateMeetingRequest {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    document?: DocumentUpload;
    removeDocument?: boolean;
}