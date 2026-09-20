import SwiftUI

// MARK: - Root Content View for iOS Tracing & Drawing Application

public struct ContentView: View {
    @StateObject private var state = TracingAppState()
    @State private var isTargetPickerPresented: Bool = false
    @State private var isExportPresented: Bool = false
    @State private var isClearConfirmationPresented: Bool = false
    
    public init() {}
    
    public var body: some View {
        ZStack {
            // Background Canvas Workspace
            DualLayerCanvasView(state: state)
                .ignoresSafeArea(.all, edges: .top)
            
            // Top Navigation Bar
            VStack {
                HStack(spacing: 12) {
                    // App Identity Pill
                    HStack(spacing: 8) {
                        Image(systemName: "pencil.and.outline")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.cyan)
                        Text("TraceDraw iOS")
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
                        Text("This will clear your foreground strokes while leaving your tracing target layer untouched.")
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
        .sheet(isPresented: $isTargetPickerPresented) {
            ImageChannelsSheet(state: state)
        }
        .sheet(isPresented: $isExportPresented) {
            ExportPhotoSheet(appState: state)
        }
        .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
}
