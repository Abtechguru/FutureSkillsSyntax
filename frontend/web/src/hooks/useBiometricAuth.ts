import { useState, useEffect, useCallback } from 'react'

interface BiometricAuthResult {
    success: boolean
    userId?: string
    error?: string
}

interface UseBiometricAuthReturn {
    isSupported: boolean
    isEnrolled: boolean
    isLoading: boolean
    error: string | null
    authenticate: () => Promise<BiometricAuthResult>
    enroll: (userId: string) => Promise<boolean>
}

/**
 * Hook for biometric authentication (Face ID, Touch ID, Fingerprint)
 * Works on supported mobile browsers and native apps
 */
export const useBiometricAuth = (): UseBiometricAuthReturn => {
    const [isSupported, setIsSupported] = useState(false)
    const [isEnrolled, setIsEnrolled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Check if WebAuthn is supported
    useEffect(() => {
        const checkSupport = async () => {
            try {
                // Check if PublicKeyCredential is available
                if (
                    window.PublicKeyCredential &&
                    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
                ) {
                    const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                    setIsSupported(available)

                    // Check if user has enrolled
                    const enrolled = localStorage.getItem('biometric_enrolled') === 'true'
                    setIsEnrolled(enrolled)
                }
            } catch (err) {
                console.error('Biometric check failed:', err)
                setIsSupported(false)
            }
        }

        checkSupport()
    }, [])

    const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
        if (!isSupported) {
            return { success: false, error: 'Biometric authentication not supported' }
        }

        if (!isEnrolled) {
            return { success: false, error: 'Biometric not enrolled' }
        }

        setIsLoading(true)
        setError(null)

        try {
            // Get stored credential ID
            const credentialId = localStorage.getItem('biometric_credential_id')
            if (!credentialId) {
                throw new Error('No stored credential found')
            }

            // Create authentication request
            const challenge = new Uint8Array(32)
            window.crypto.getRandomValues(challenge)

            const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
                challenge,
                allowCredentials: [
                    {
                        id: Uint8Array.from(atob(credentialId), c => c.charCodeAt(0)),
                        type: 'public-key',
                        transports: ['internal'],
                    },
                ],
                userVerification: 'required',
                timeout: 60000,
            }

            const credential = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions,
            })

            if (credential) {
                const userId = localStorage.getItem('biometric_user_id')
                return { success: true, userId: userId || undefined }
            }

            return { success: false, error: 'Authentication failed' }
        } catch (err: any) {
            const errorMessage = err.name === 'NotAllowedError'
                ? 'Authentication was cancelled'
                : 'Biometric authentication failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setIsLoading(false)
        }
    }, [isSupported, isEnrolled])

    const enroll = useCallback(async (userId: string): Promise<boolean> => {
        if (!isSupported) {
            setError('Biometric authentication not supported')
            return false
        }

        setIsLoading(true)
        setError(null)

        try {
            // Create registration request
            const challenge = new Uint8Array(32)
            window.crypto.getRandomValues(challenge)

            const userIdArray = new TextEncoder().encode(userId)

            const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
                challenge,
                rp: {
                    name: 'FutureSkillsSyntax',
                    id: window.location.hostname,
                },
                user: {
                    id: userIdArray,
                    name: userId,
                    displayName: 'User',
                },
                pubKeyCredParams: [
                    { alg: -7, type: 'public-key' }, // ES256
                    { alg: -257, type: 'public-key' }, // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    userVerification: 'required',
                    residentKey: 'preferred',
                },
                timeout: 60000,
                attestation: 'none',
            }

            const credential = await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions,
            }) as PublicKeyCredential | null

            if (credential) {
                // Store credential ID
                const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
                localStorage.setItem('biometric_credential_id', credentialId)
                localStorage.setItem('biometric_user_id', userId)
                localStorage.setItem('biometric_enrolled', 'true')
                setIsEnrolled(true)
                return true
            }

            return false
        } catch (err: any) {
            const errorMessage = err.name === 'NotAllowedError'
                ? 'Enrollment was cancelled'
                : 'Biometric enrollment failed'
            setError(errorMessage)
            return false
        } finally {
            setIsLoading(false)
        }
    }, [isSupported])

    return {
        isSupported,
        isEnrolled,
        isLoading,
        error,
        authenticate,
        enroll,
    }
}

export default useBiometricAuth
