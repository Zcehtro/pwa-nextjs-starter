import { CSSProperties, FC } from 'react';
import { useRouter } from 'next/router';
import Link from './Link';

const style: CSSProperties = {
  color: '#0070f3',
  textDecoration: 'underline'
};

interface Props {
  text: string;
  href: string;
}

export const ActiveLink: FC<Props> = ({ text, href }) => {
  const router = useRouter();

  const active = router.asPath === href;

  return (
    <Link href={href} style={active ? style : undefined}>
      <span>{text}</span>
    </Link>
  );
};
