FROM rust:1.87-alpine AS chef
RUN apk add --no-cache musl-dev openssl-dev openssl-libs-static pkgconf curl
RUN cargo install cargo-chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release --bin dino-atlas-api

FROM alpine:3.21
RUN apk add --no-cache ca-certificates && adduser -D -s /bin/false appuser
WORKDIR /app
COPY --from=builder /app/target/release/dino-atlas-api .
USER appuser
EXPOSE 3001
CMD ["./dino-atlas-api"]
