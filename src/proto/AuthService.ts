// Original file: a.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { LoginRequest as _LoginRequest, LoginRequest__Output as _LoginRequest__Output } from './LoginRequest';
import type { RegisterRequest as _RegisterRequest, RegisterRequest__Output as _RegisterRequest__Output } from './RegisterRequest';
import type { Token as _Token, Token__Output as _Token__Output } from './Token';
import type { Tokens as _Tokens, Tokens__Output as _Tokens__Output } from './Tokens';
import type { ValidationResponse as _ValidationResponse, ValidationResponse__Output as _ValidationResponse__Output } from './ValidationResponse';

export interface AuthServiceClient extends grpc.Client {
  Login(argument: _LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  Login(argument: _LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  Login(argument: _LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  Login(argument: _LoginRequest, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  login(argument: _LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  login(argument: _LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  login(argument: _LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  login(argument: _LoginRequest, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  
  RefreshToken(argument: _Token, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  RefreshToken(argument: _Token, metadata: grpc.Metadata, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  RefreshToken(argument: _Token, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  RefreshToken(argument: _Token, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _Token, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _Token, metadata: grpc.Metadata, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _Token, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _Token, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  
  Register(argument: _RegisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  Register(argument: _RegisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  Register(argument: _RegisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  Register(argument: _RegisterRequest, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  register(argument: _RegisterRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  register(argument: _RegisterRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  register(argument: _RegisterRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  register(argument: _RegisterRequest, callback: grpc.requestCallback<_Tokens__Output>): grpc.ClientUnaryCall;
  
  ValidateToken(argument: _Token, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  ValidateToken(argument: _Token, metadata: grpc.Metadata, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  ValidateToken(argument: _Token, options: grpc.CallOptions, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  ValidateToken(argument: _Token, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  validateToken(argument: _Token, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  validateToken(argument: _Token, metadata: grpc.Metadata, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  validateToken(argument: _Token, options: grpc.CallOptions, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  validateToken(argument: _Token, callback: grpc.requestCallback<_ValidationResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthServiceHandlers extends grpc.UntypedServiceImplementation {
  Login: grpc.handleUnaryCall<_LoginRequest__Output, _Tokens>;
  
  RefreshToken: grpc.handleUnaryCall<_Token__Output, _Tokens>;
  
  Register: grpc.handleUnaryCall<_RegisterRequest__Output, _Tokens>;
  
  ValidateToken: grpc.handleUnaryCall<_Token__Output, _ValidationResponse>;
  
}

export interface AuthServiceDefinition extends grpc.ServiceDefinition {
  Login: MethodDefinition<_LoginRequest, _Tokens, _LoginRequest__Output, _Tokens__Output>
  RefreshToken: MethodDefinition<_Token, _Tokens, _Token__Output, _Tokens__Output>
  Register: MethodDefinition<_RegisterRequest, _Tokens, _RegisterRequest__Output, _Tokens__Output>
  ValidateToken: MethodDefinition<_Token, _ValidationResponse, _Token__Output, _ValidationResponse__Output>
}
