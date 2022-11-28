import { Types } from 'mongoose';
export interface Tokens {
	kind: string;
	accessToken: string;
	tokenSecret?: string;
}

export interface IUser {
	email: string;
	password: string;
	passwordResetToken: string;
	passwordResetExpires: Date;

	facebook: string;
	twitter: string;
	google: string;
	github: string;
	instagram: string;
	linkedin: string;
	tokens: Tokens[];
	steam: string;

	fullname: string;
	gender: string;
	geolocation: string;
	website: string;
	picture: string;
    sentRequests: Array<Types.ObjectId>,
    receivedRequests: Array<Types.ObjectId>,
    friends: Array<Types.ObjectId>
}

export default IUser;