-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create analyses table to store upload metadata
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  total_packets INTEGER DEFAULT 0,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create traffic_data table to store parsed packet information
CREATE TABLE public.traffic_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  protocol TEXT NOT NULL,
  source_ip TEXT,
  dest_ip TEXT,
  source_port INTEGER,
  dest_port INTEGER,
  packet_size INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE,
  info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create protocol_stats table for aggregated statistics
CREATE TABLE public.protocol_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  protocol TEXT NOT NULL,
  packet_count INTEGER NOT NULL DEFAULT 0,
  total_bytes BIGINT NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analyses table
CREATE POLICY "Users can view their own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
  ON public.analyses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON public.analyses FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for traffic_data table
CREATE POLICY "Users can view traffic data from their analyses"
  ON public.traffic_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.analyses
      WHERE analyses.id = traffic_data.analysis_id
      AND analyses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert traffic data for their analyses"
  ON public.traffic_data FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.analyses
      WHERE analyses.id = traffic_data.analysis_id
      AND analyses.user_id = auth.uid()
    )
  );

-- RLS Policies for protocol_stats table
CREATE POLICY "Users can view protocol stats from their analyses"
  ON public.protocol_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.analyses
      WHERE analyses.id = protocol_stats.analysis_id
      AND analyses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert protocol stats for their analyses"
  ON public.protocol_stats FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.analyses
      WHERE analyses.id = protocol_stats.analysis_id
      AND analyses.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_traffic_data_analysis_id ON public.traffic_data(analysis_id);
CREATE INDEX idx_traffic_data_protocol ON public.traffic_data(protocol);
CREATE INDEX idx_protocol_stats_analysis_id ON public.protocol_stats(analysis_id);