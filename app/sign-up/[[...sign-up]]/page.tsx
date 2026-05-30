import { SignUp } from '@clerk/nextjs'
import '@/app/globals.css';
export default function Page() {
  return (
    <div className="authPage">
      <SignUp />
    </div>
  );
}