# Nordiseat Frontend

## Running the app

0. Ensure the correct environment variables are set

create a `.env` file containing the following:

```bash
REQUEST_ORIGIN=https://nordiseat.netlify.app

VITE_IAM_API_URL=http://localhost:5173/api-iam
IAM_API_URL=http://10.212.26.218/iam

VITE_EVENT_API_URL=http://localhost:5173/api-event
EVENT_API_URL=http://10.212.26.218/event

VITE_ORDER_API_URL=http://localhost:5173/api-order
ORDER_API_URL=http://10.212.26.218/order
```

1. Install dependencies

```bash
npm install
```

2. Run the app

```bash
npm run dev
```
