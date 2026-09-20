import SwiftUI

// MARK: - Root Content View for iOS Tracing & Drawing Application

public struct ContentView: View {
    @StateObject private var state = TracingAppState()
    @State private var isTargetPickerPresented: Bool = false
    @State private var isExportPresented: Bool = false
    @State private var isClearConfirmationPresented: Bool = false
    
    // Startup: 3 Random Drawing Options
    @State private var isStartupPresented: Bool = true
    @State private var startupOptions: [VectorShapeType] = []
    
    public init() {}
    
    public var body: some View {
        ZStack {
            // Background Canvas Workspace
            DualLayerCanvasView(state: state)
                .ignoresSafeArea(.all, edges: .top)
            
            // Top Navigation Bar
            VStack {
                HStack(spacing: 12) {
                    // App Identity Pill (Branding cleaned)
                    HStack(spacing: 8) {
                        Image(systemName: "pencil.and.outline")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.cyan)
                        Text("Drawing Studio")
                            .font(.system(size: 15, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Color(red: 0.12, green: 0.12, blue: 0.14).opacity(0.85))
                    .clipShape(Capsule())
                    .overlay(
                        Capsule()
                            .stroke(Color.white.opacity(0.12), lineWidth: 1)
                    )
                    
                    Spacer()
                    
                    // Export to Photos Button
                    Button {
                        isExportPresented = true
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "square.and.arrow.up")
                                .font(.system(size: 13, weight: .bold))
                            Text("Export")
                                .font(.system(size: 13, weight: .bold))
                        }
                        .foregroundColor(.cyan)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Color(red: 0.12, green: 0.12, blue: 0.14).opacity(0.85))
                        .clipShape(Capsule())
                        .overlay(
                            Capsule()
                                .stroke(Color.cyan.opacity(0.35), lineWidth: 1)
                        )
                    }
                    
                    // Clear Canvas Action
                    Button {
                        if !state.lines.isEmpty {
                            isClearConfirmationPresented = true
                        }
                    } label: {
                        Image(systemName: "trash")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.gray)
                            .frame(width: 36, height: 36)
                            .background(Color(red: 0.12, green: 0.12, blue: 0.14).opacity(0.85))
                            .clipShape(Circle())
                            .overlay(
                                Circle()
                                    .stroke(Color.white.opacity(0.12), lineWidth: 1)
                            )
                    }
                    .disabled(state.lines.isEmpty)
                    .opacity(state.lines.isEmpty ? 0.4 : 1.0)
                    .confirmationDialog(
                        "Clear Drawing Canvas?",
                        isPresented: $isClearConfirmationPresented,
                        titleVisibility: .visible
                    ) {
                        Button("Clear All Strokes", role: .destructive) {
                            state.clearCanvas()
                        }
                        Button("Cancel", role: .cancel) {}
                    } message: {
                        Text("This will clear your foreground strokes while leaving your drawing layer untouched.")
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 10)
                
                Spacer()
                
                // Bottom Toolbar with Brush Kit, Eraser, Undo/Redo, Quick Eye, and Import Trigger
                BottomToolbarView(
                    state: state,
                    isTargetPickerPresented: $isTargetPickerPresented,
                    isExportPresented: $isExportPresented
                )
            }
        }
        .onAppear {
            if startupOptions.isEmpty {
                startupOptions = TracingAppState.generateRandomOptions(count: 3)
            }
        }
        .sheet(isPresented: $isStartupPresented) {
            StartupOptionsSheet(
                options: $startupOptions,
                onSelectOption: { chosenShape in
                    state.setVectorTarget(chosenShape)
                    isStartupPresented = false
                },
                onExploreAll: {
                    isStartupPresented = false
                    isTargetPickerPresented = true
                }
            )
        }
        .sheet(isPresented: $isTargetPickerPresented) {
            ImageChannelsSheet(state: state)
        }
        .sheet(isPresented: $isExportPresented) {
            ExportPhotoSheet(appState: state)
        }
        .preferredColorScheme(.dark)
    }
}

// MARK: - Startup 3 Random Options Sheet
public struct StartupOptionsSheet: View {
    @Binding public var options: [VectorShapeType]
    public let onSelectOption: (VectorShapeType) -> Void
    public let onExploreAll: () -> Void
    @Environment(\.dismiss) private var dismiss
    
    public init(
        options: Binding<[VectorShapeType]>,
        onSelectOption: @escaping (VectorShapeType) -> Void,
        onExploreAll: @escaping () -> Void
    ) {
        self._options = options
        self.onSelectOption = onSelectOption
        self.onExploreAll = onExploreAll
    }
    
    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.10, green: 0.10, blue: 0.12)
                    .ignoresSafeArea()
                
                VStack(spacing: 24) {
                    // Header Description
                    VStack(spacing: 6) {
                        Text("Pick a Drawing to Start")
                            .font(.system(size: 22, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        Text("Choose one of 3 random drawings to begin your session:")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, 16)
                    
                    // 3 Interactive Options Cards
                    VStack(spacing: 12) {
                        ForEach(options) { shape in
                            Button {
                                onSelectOption(shape)
                            } label: {
                                HStack(spacing: 16) {
                                    // Shape Vector Icon Box
                                    ZStack {
                                        RoundedRectangle(cornerRadius: 14)
                                            .fill(Color.white.opacity(0.06))
                                            .frame(width: 64, height: 64)
                                        
                                        VectorShapeView(shapeType: shape, strokeColor: .cyan, lineWidth: 2.5)
                                            .frame(width: 42, height: 42)
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(shape.rawValue)
                                            .font(.system(size: 16, weight: .bold, design: .rounded))
                                            .foregroundColor(.white)
                                        
                                        HStack(spacing: 6) {
                                            Text(shape.category.rawValue.capitalized)
                                                .font(.system(size: 11, weight: .heavy))
                                                .foregroundColor(.cyan)
                                                .padding(.horizontal, 7)
                                                .padding(.vertical, 2)
                                                .background(Color.cyan.opacity(0.15))
                                                .clipShape(Capsule())
                                            
                                            Text("Tap to draw")
                                                .font(.system(size: 12, weight: .medium))
                                                .foregroundColor(.gray)
                                        }
                                    }
                                    
                                    Spacer()
                                    
                                    Image(systemName: "pencil.line")
                                        .font(.system(size: 18, weight: .semibold))
                                        .foregroundColor(.cyan)
                                }
                                .padding(14)
                                .background(Color(red: 0.16, green: 0.16, blue: 0.18))
                                .cornerRadius(18)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 18)
                                        .stroke(Color.white.opacity(0.10), lineWidth: 1)
                                )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    Spacer()
                    
                    // Secondary Controls: Shuffle or Browse All
                    VStack(spacing: 10) {
                        Button {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                options = TracingAppState.generateRandomOptions(count: 3)
                            }
                        } label: {
                            HStack(spacing: 8) {
                                Image(systemName: "dice.fill")
                                    .font(.system(size: 14, weight: .bold))
                                Text("Shuffle 3 New Options")
                                    .font(.system(size: 14, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color.white.opacity(0.08))
                            .clipShape(Capsule())
                        }
                        
                        Button {
                            onExploreAll()
                        } label: {
                            Text("Browse All 25 Drawings in Library")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.cyan)
                        }
                        .padding(.top, 4)
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)
                }
            }
            .navigationTitle("Welcome")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Skip") {
                        dismiss()
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.gray)
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
