import { CSSProperties, FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const style: CSSProperties = {
  color: '#0070f3',
  textDecoration: 'underline',
};

interface Props {
  text: string;
  href: string;
}

export const ActiveLink: FC<Props> = ({ text, href }) => {
  const router = useRouter();

  const active = router.asPath === href;

  return (
    <Link href={href}>
      <a style={active ? style : undefined}>
        <span>{text}</span>
      </a>
    </Link>
  );
};
