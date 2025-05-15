type TimelineItem = {
    id: string;
    date: string;
    title: string;
    content: string;
    icon?: string;
    type: 'work' | 'education' | 'project';
};
export default TimelineItem;