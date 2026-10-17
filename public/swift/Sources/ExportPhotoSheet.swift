import SwiftUI
import Photos

public enum SwiftExportBackground: String, CaseIterable, Identifiable {
    case transparent = "Transparent"
    case darkMat = "Dark Studio"
    case composite = "With Reference"
    
    public var id: String { rawValue }
}

public struct ExportPhotoSheet: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject var appState: TracingAppState
    
    @State private var selectedBackground: SwiftExportBackground = .darkMat
    @State private var exportScale: CGFloat = 2.0
    @State private var isSaving: Bool = false
    @State private var showSuccessAlert: Bool = false
    @State private var errorMessage: String?
    @State private var showErrorAlert: Bool = false
    
    public init(appState: TracingAppState) {
        self.appState = appState
    }
    
    public var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.08, green: 0.08, blue: 0.10)
                    .ignoresSafeArea()
                
                VStack(spacing: 20) {
                    // Preview Card
                    ZStack {
                        // Background Mat
                        Group {
                            switch selectedBackground {
                            case .transparent:
                                // Checkerboard representation
                                Rectangle()
                                    .fill(Color(white: 0.15))
                            case .darkMat:
                                Rectangle()
                                    .fill(Color(red: 0.10, green: 0.10, blue: 0.12))
                            case .composite:
                                ZStack {
                                    Rectangle()
                                        .fill(Color(red: 0.10, green: 0.10, blue: 0.12))
                                    // Template preview
                                    if case let .vector(shape) = appState.referenceTarget {
                                        VectorRendererView(shapeType: shape, strokeColor: Color.cyan.opacity(0.4), lineWidth: 2)
                                            .padding(30)
                                    } else if case let .symbol(sym) = appState.referenceTarget {
                                        Image(systemName: sym)
                                            .resizable()
                                            .scaledToFit()
                                            .foregroundColor(Color.cyan.opacity(0.4))
                                            .padding(30)
                                    } else if case let .image(uiImg) = appState.referenceTarget {
                                        Image(uiImage: uiImg)
                                            .resizable()
                                            .scaledToFit()
                                            .opacity(0.4)
                                            .padding(20)
                                    }
                                }
                            }
                        }
                        
                        // Drawing Lines Canvas Preview
                        Canvas { context, size in
                            for line in appState.lines {
                                var path = Path()
                                guard let first = line.points.first else { continue }
                                path.move(to: first)
                                for pt in line.points.dropFirst() {
                                    path.addLine(to: pt)
                                }
                                
                                if line.isEraser {
                                    context.blendMode = .clear
                                    context.stroke(path, with: .color(.clear), style: StrokeStyle(lineWidth: line.lineWidth, lineCap: .round, lineJoin: .round))
                                } else {
                                    context.blendMode = .normal
                                    context.stroke(
                                        path,
                                        with: .color(line.color.opacity(line.opacity)),
                                        style: StrokeStyle(lineWidth: line.lineWidth, lineCap: .round, lineJoin: .round)
                                    )
                                }
                            }
                        }
                    }
                    .frame(width: 280, height: 280)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.white.opacity(0.15), lineWidth: 1)
                    )
                    .shadow(color: .black.opacity(0.4), radius: 15, x: 0, y: 8)
                    
                    // Options Form
                    VStack(alignment: .leading, spacing: 14) {
                        Text("BACKGROUND STYLE")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.gray)
                        
                        Picker("Background", selection: $selectedBackground) {
                            ForEach(SwiftExportBackground.allCases) { bg in
                                Text(bg.rawValue).tag(bg)
                            }
                        }
                        .pickerStyle(.segmented)
                        
                        Text("RESOLUTION")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.gray)
                        
                        Picker("Scale", selection: $exportScale) {
                            Text("1x (Standard)").tag(CGFloat(1.0))
                            Text("2x (Retina HD)").tag(CGFloat(2.0))
                            Text("3x (Ultra 4K)").tag(CGFloat(3.0))
                        }
                        .pickerStyle(.segmented)
                    }
                    .padding(.horizontal)
                    
                    Spacer()
                    
                    // Save to Photos Button
                    Button {
                        saveToPhotos()
                    } label: {
                        HStack(spacing: 8) {
                            if isSaving {
                                ProgressView()
                                    .tint(.black)
                            } else {
                                Image(systemName: "square.and.arrow.down.fill")
                                    .font(.system(size: 15, weight: .bold))
                            }
                            Text(isSaving ? "Rendering..." : "Save to Photos")
                                .font(.system(size: 16, weight: .bold))
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.cyan)
                        .foregroundColor(.black)
                        .clipShape(Capsule())
                        .shadow(color: Color.cyan.opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                    .disabled(isSaving)
                    .padding(.horizontal)
                    .padding(.bottom, 10)
                }
                .padding(.top, 10)
            }
            .navigationTitle("Export to Photos")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .foregroundColor(.cyan)
                    .fontWeight(.semibold)
                }
            }
            .alert("Saved to Photos!", isPresented: $showSuccessAlert) {
                Button("OK") { dismiss() }
            } message: {
                Text("Your artwork has been saved directly to your iOS Photos Library.")
            }
            .alert("Export Error", isPresented: $showErrorAlert) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage ?? "Could not save photo.")
            }
        }
    }
    
    private func saveToPhotos() {
        isSaving = true
        
        let baseSize = CGSize(width: 1080, height: 1080)
        let canvasSize = CGSize(width: baseSize.width * exportScale, height: baseSize.height * exportScale)
        let format = UIGraphicsImageRendererFormat()
        format.scale = 1.0
        format.opaque = selectedBackground != .transparent
        
        let renderer = UIGraphicsImageRenderer(size: canvasSize, format: format)
        let image = renderer.image { ctx in
            let cgContext = ctx.cgContext
            
            switch selectedBackground {
            case .transparent:
                break
            case .darkMat, .composite:
                cgContext.setFillColor(UIColor(red: 0.98, green: 0.976, blue: 0.961, alpha: 1).cgColor)
                cgContext.fill(CGRect(origin: .zero, size: canvasSize))
            }
            
            // Export the exact on-screen coordinate space. The old implementation fit
            // only the strokes, which moved them away from the reference layer.
            let sourceSize = CGSize(
                width: max(appState.canvasSize.width, 1),
                height: max(appState.canvasSize.height, 1)
            )
            let outputScaleX = canvasSize.width / sourceSize.width
            let outputScaleY = canvasSize.height / sourceSize.height

            cgContext.saveGState()
            cgContext.scaleBy(x: outputScaleX, y: outputScaleY)

            for line in appState.lines {
                guard let first = line.points.first else { continue }
                cgContext.beginPath()
                cgContext.move(to: first)
                for pt in line.points.dropFirst() { cgContext.addLine(to: pt) }
                cgContext.setLineCap(.round)
                cgContext.setLineJoin(.round)
                cgContext.setLineWidth(line.lineWidth)
                
                if line.isEraser {
                    // Erasing should reveal the selected background, not punch holes in opaque exports.
                    if selectedBackground == .transparent {
                        cgContext.setBlendMode(.clear)
                    } else {
                        cgContext.setBlendMode(.normal)
                        cgContext.setStrokeColor(UIColor(red: 0.98, green: 0.976, blue: 0.961, alpha: 1).cgColor)
                    }
                } else {
                    cgContext.setBlendMode(.normal)
                    cgContext.setStrokeColor(UIColor(line.color).withAlphaComponent(line.opacity).cgColor)
                }
                cgContext.strokePath()
            }
            cgContext.restoreGState()
            
            if selectedBackground == .composite {
                cgContext.saveGState()
                cgContext.scaleBy(x: outputScaleX, y: outputScaleY)
                cgContext.translateBy(x: sourceSize.width / 2, y: sourceSize.height / 2)
                cgContext.translateBy(x: appState.referenceTransform.offset.width,
                                      y: appState.referenceTransform.offset.height)
                cgContext.scaleBy(x: appState.referenceTransform.scale,
                                  y: appState.referenceTransform.scale)
                let referenceSide = min(sourceSize.width, sourceSize.height) * 0.72
                let refRect = CGRect(x: -referenceSide / 2, y: -referenceSide / 2,
                                     width: referenceSide, height: referenceSide)
                switch appState.referenceTarget {
                case let .vector(shape):
                    let renderer = ImageRenderer(content: VectorRendererView(shapeType: shape, strokeColor: Color(red: 0.145, green: 0.388, blue: 0.922), lineWidth: 4).frame(width: 840, height: 840))
                    if let refImage = renderer.uiImage { refImage.draw(in: refRect) }
                case let .symbol(symbol):
                    let renderer = ImageRenderer(content: Image(systemName: symbol).resizable().scaledToFit().foregroundColor(Color(red: 0.145, green: 0.388, blue: 0.922)).frame(width: 840, height: 840))
                    if let refImage = renderer.uiImage { refImage.draw(in: refRect) }
                case let .image(image):
                    image.draw(in: refRect.insetBy(dx: 30, dy: 30))
                }
                cgContext.restoreGState()
            }
        }
        
        PHPhotoLibrary.requestAuthorization(for: .addOnly) { status in
            DispatchQueue.main.async {
                self.isSaving = false
                if status == .authorized || status == .limited {
                    UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
                    let generator = UINotificationFeedbackGenerator()
                    generator.notificationOccurred(.success)
                    self.showSuccessAlert = true
                } else {
                    self.errorMessage = "Please enable Photo Library write access in iOS Settings to save your drawings."
                    self.showErrorAlert = true
                }
            }
        }
    }
}
