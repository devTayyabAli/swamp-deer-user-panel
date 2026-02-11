import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyEmail } from '../redux/slices/authSlice';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import type { AppDispatch } from '../redux/store'; // Assuming store exports type

const VerifyEmail = () => {
    const { token } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            dispatch(verifyEmail(token) as any) // Type assertion if thunk types are tricky
                .unwrap()
                .then((msg: string) => {
                    setStatus('success');
                    setMessage(msg || 'Email verified successfully!');
                })
                .catch((err: string) => {
                    setStatus('error');
                    setMessage(err || 'Verification failed. Link may be invalid or expired.');
                });
        } else {
            setStatus('error');
            setMessage('Invalid verification link.');
        }
    }, [token, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-page-bg p-4">
            <div className="max-w-md w-full bg-card-bg rounded-xl shadow-lg border border-border-subtle p-8 text-center flex flex-col items-center gap-6">
                {status === 'loading' && (
                    <>
                        <Loader className="w-16 h-16 text-blue-500 animate-spin" />
                        <h2 className="text-xl font-bold text-text-main">Verifying your email...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 text-green-500" />
                        <h2 className="text-2xl font-bold text-text-main">Verified!</h2>
                        <p className="text-text-muted">{message}</p>
                        <Link to="/login" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-deep-green transition font-medium">
                            Go to Login
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-16 h-16 text-red-500" />
                        <h2 className="text-2xl font-bold text-text-main">Verification Failed</h2>
                        <p className="text-text-muted">{message}</p>
                        <Link to="/login" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-deep-green transition font-medium">
                            Back to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
