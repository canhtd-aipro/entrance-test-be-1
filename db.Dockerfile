FROM postgres:15-bookworm

# Install PostGIS + pgvector
RUN apt-get update \
  && apt-get install -y \
  postgresql-15-postgis-3 \
  postgresql-15-postgis-3-scripts \
  postgresql-15-pgvector \
  && rm -rf /var/lib/apt/lists/*

