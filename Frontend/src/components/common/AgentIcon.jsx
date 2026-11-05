import React from 'react';
import {
  MessageSquare,
  Code2,
  Presentation,
  FileText,
  Image as ImageIcon,
  Globe,
  Sparkles,
} from 'lucide-react';

const iconMap = {
  chat: MessageSquare,
  coding: Code2,
  ppt: Presentation,
  pdf: FileText,
  image: ImageIcon,
  search: Globe,
};

export const AgentIcon = ({ agentId, className = 'w-5 h-5', style }) => {
  const IconComponent = iconMap[agentId] || Sparkles;
  return <IconComponent className={className} style={style} />;
};

export default AgentIcon;
