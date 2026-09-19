// swift-tools-version: 5.9
// The Package.swift for Swift Playgrounds on iPadOS & iOS — 100% Zero Dependencies & 100% Offline
import PackageDescription
import AppleProductTypes

let package = Package(
    name: "TraceDraw",
    platforms: [
        .iOS("16.0")
    ],
    products: [
        .iOSApplication(
            name: "TraceDraw iOS",
            targets: ["AppModule"],
            bundleIdentifier: "com.apple.expert.tracedraw",
            teamIdentifier: "",
            displayVersion: "1.1",
            bundleVersion: "2",
            appIcon: .placeholder(icon: .paintbrush),
            accentColor: .presetColor(.cyan),
            supportedDeviceFamilies: [
                .pad,
                .phone
            ],
            supportedInterfaceOrientations: [
                .portrait,
                .landscapeRight,
                .landscapeLeft,
                .portraitUpsideDown
            ],
            capabilities: [
                .photoLibrary(purposeString: "Import reference photos to trace directly on your canvas workspace"),
                .photoLibraryAdd(purposeString: "Save your exported drawings directly to your iOS Camera Roll / Photos library")
            ]
        )
    ],
    dependencies: [
        // 100% local, offline, zero external dependencies!
        // Uses native SwiftUI, PhotosUI, CoreGraphics Canvas, ImageRenderer, and UniformTypeIdentifiers.
    ],
    targets: [
        .executableTarget(
            name: "AppModule",
            dependencies: [],
            path: "Sources"
        )
    ]
)
