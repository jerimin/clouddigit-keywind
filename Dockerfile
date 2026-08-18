# Cloud Digit Keycloak login theme (keywind fork).
# Final image contains ONLY the built theme at /theme, which the OSIE chart's
# initContainer copies into /keycloak-theme -> mounted as theme "osie".
FROM node:18 AS builder
WORKDIR /builder
COPY . /builder
RUN npm install --no-audit --no-fund
RUN npm run build

FROM alpine:latest
COPY --from=builder /builder/theme/keywind /theme
