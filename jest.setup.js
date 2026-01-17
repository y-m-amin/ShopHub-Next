import '@testing-library/jest-dom';

// Polyfill for Next.js Request/Response objects
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js server components
global.Request = global.Request || class Request {};
global.Response = global.Response || class Response {};
global.Headers = global.Headers || class Headers {};

// Mock fetch for API tests
global.fetch = global.fetch || jest.fn();
