import { useState, useEffect, useCallback } from 'react'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import * as Haptics from 'expo-haptics'

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled'

interface BiometricAuthResult {
    success: boolean
    error?: string
}

interface UseBiometricAuth {
    isAvailable: boolean
    isEnabled: boolean
    biometricType: LocalAuthentication.AuthenticationType | null
    authenticate: () => Promise<BiometricAuthResult>
    enableBiometric: () => Promise<boolean>
    disableBiometric: () => Promise<void>
    checkEnrollment: () => Promise<boolean>
}

export const useBiometricAuth = (): UseBiometricAuth => {
    const [isAvailable, setIsAvailable] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false)
    const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType | null>(null)

    useEffect(() => {
        checkBiometricAvailability()
        checkBiometricEnabled()
    }, [])

    const checkBiometricAvailability = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync()
        const enrolled = await LocalAuthentication.isEnrolledAsync()
        setIsAvailable(compatible && enrolled)

        if (compatible) {
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
            if (types.length > 0) {
                // Prefer Face ID over Fingerprint
                if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                    setBiometricType(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
                } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                    setBiometricType(LocalAuthentication.AuthenticationType.FINGERPRINT)
                }
            }
        }
    }

    const checkBiometricEnabled = async () => {
        const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY)
        setIsEnabled(enabled === 'true')
    }

    const checkEnrollment = useCallback(async (): Promise<boolean> => {
        return await LocalAuthentication.isEnrolledAsync()
    }, [])

    const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
        if (!isAvailable) {
            return { success: false, error: 'Biometric authentication not available' }
        }

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to continue',
                cancelLabel: 'Cancel',
                disableDeviceFallback: false,
                fallbackLabel: 'Use passcode',
            })

            if (result.success) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                return { success: true }
            } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                return {
                    success: false,
                    error: result.error === 'user_cancel' ? 'Cancelled' : 'Authentication failed'
                }
            }
        } catch (error) {
            return { success: false, error: 'An error occurred during authentication' }
        }
    }, [isAvailable])

    const enableBiometric = useCallback(async (): Promise<boolean> => {
        if (!isAvailable) return false

        const result = await authenticate()
        if (result.success) {
            await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true')
            setIsEnabled(true)
            return true
        }
        return false
    }, [isAvailable, authenticate])

    const disableBiometric = useCallback(async () => {
        await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY)
        setIsEnabled(false)
    }, [])

    return {
        isAvailable,
        isEnabled,
        biometricType,
        authenticate,
        enableBiometric,
        disableBiometric,
        checkEnrollment,
    }
}

export const getBiometricTypeName = (type: LocalAuthentication.AuthenticationType | null): string => {
    switch (type) {
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            return 'Face ID'
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
            return 'Touch ID'
        case LocalAuthentication.AuthenticationType.IRIS:
            return 'Iris'
        default:
            return 'Biometric'
    }
}
