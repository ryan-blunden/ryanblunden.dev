import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

interface Props {
	calLink: string;
	namespace?: string;
	view?: 'month_view' | 'week_view' | 'column_view';
}

export default function CalEmbed({
	calLink,
	namespace = '30min',
	view = 'month_view',
}: Props) {
	useEffect(() => {
		(async () => {
			const cal = await getCalApi({ namespace });
			cal('ui', { hideEventTypeDetails: false, layout: view });
		})();
	}, [namespace, view]);

	return (
		<Cal
			namespace={namespace}
			calLink={calLink}
			style={{ width: '100%', height: '100%', overflow: 'scroll' }}
			config={{ layout: view }}
		/>
	);
}
